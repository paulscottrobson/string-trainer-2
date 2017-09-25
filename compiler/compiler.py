# ***********************************************************************************************************
# ***********************************************************************************************************
#
#												COMPILER
#
# ***********************************************************************************************************
# ***********************************************************************************************************

import instruments,note,sys
from exceptions import *

# ***********************************************************************************************************
#
#										Bar representation class
#
# ***********************************************************************************************************

class Bar:
	def __init__(self,definition,instrument):
		self.notes = []
		self.labels = {}
		qbSize = 0
		for noteDef in [x.strip() for x in definition.split(" ") if x.strip() != ""]:
			if noteDef[0] == '[':
				self.labels[len(self.notes)] = noteDef
			else:
				note = instrument.createNote(noteDef)
				self.notes.append(note)
				qbSize += note.getQBLength();

	def render(self):
		render = []
		for i in range(0,len(self.notes)):
			if i in self.labels:
				render.append(self.labels[i])
			render.append(self.notes[i].render())
		return ";".join(render)

# ***********************************************************************************************************
#
#											Compiler worker class
#
# ***********************************************************************************************************

class Compiler:

	def compile(self,instrument,inStream,outStream,errorStream=sys.stderr):
		self.source = inStream.readlines()
		self.instrument = instrument
		self.errorLine = 0
		try:
			self.preProcess()
			self.processAssignments()
			#print(self.source,self.assigns)
			self.bars = []
			for n in range(0,len(self.source)):
				self.errorLine = n+1
				musicLine = self.source[n]
				if musicLine != "" and musicLine.find(":=") < 0:
					for barDef in [x.strip() for x in musicLine.split("|") if x.strip() != ""]:
						bar = Bar(barDef,self.instrument)
						self.bars.append(bar)
						#print(bar.render())						
			outStream.write("{\n")
			self.renderAssignments(outStream)
			outStream.write('    "bars":[\n')						
			self.renderBars(outStream)
			outStream.write('    ]\n}\n')
		except CompilerException as ex:
			msg = ex.getMessage()
			if self.errorLine > 0:
				msg = msg + " at line "+str(self.errorLine)
			errorStream.write(msg+"\n")
			return False
		return True

	def preProcess(self):
		self.source = [x if x != "" and x[0] != '#' else "" for x in self.source]
		self.source = [x.replace("\t"," ").strip() for x in self.source]

	def processAssignments(self):
		self.assigns = {}
		for k in Compiler.ASSIGNS.keys():
			self.assigns[k.lower()] = Compiler.ASSIGNS[k].lower()
		self.assigns["instrument"] = self.instrument.getName()
		self.assigns["subtype"] = self.instrument.getSubtype()
		for assign in [x for x in self.source if x.find(":=") >= 0]:
			assp = [x.strip().lower() for x in assign.split(":=")]
			if len(assp) != 2 or assp[0] == "" or assign.find('"') >= 0:
				raise CompilerException("Syntax error in assignment")
			if assp[0] not in self.assigns:
				raise CompilerException("Unknown assignment key")
			self.assigns[assp[0]] = assp[1]

	def renderAssignments(self,outStream):
		keys = [x for x in self.assigns.keys()]
		keys.sort()
		for k in keys:
			outStream.write('    "{0}":"{1}",\n'.format(k,self.assigns[k]))

	def renderBars(self,outStream):
		barRender = ['        "'+x.render()+'"' for x in self.bars]
		outStream.write(",\n".join(barRender))
		outStream.write("\n")

	def getBeats(self):
		return int(self.assigns["beats"])

Compiler.ASSIGNS = { "title":"","instrument":"","subtype":"","tuning":"","capo":"0","beats":"4", \
					 "speed":"100","composer":"","translator":"" }

dulcimer = instruments.Dulcimer()	
harmonica = instruments.Harmonica()

compiler = Compiler()
#compiler.compile(dulcimer,open("waterbound.music"),sys.stdout,sys.stdout)
compiler.compile(dulcimer,open("waterbound.music"),open("../app/music.json","w"),sys.stdout)

#compiler.compile(harmonica,open("love_me_do.harp"),sys.stdout,sys.stdout)
compiler.compile(harmonica,open("ode_to_joy.harp"),open("../app/music2.json","w"),sys.stdout)

