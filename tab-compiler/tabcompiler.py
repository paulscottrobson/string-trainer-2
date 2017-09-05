import sys

# *************************************************************************************************
#
#									  Compiler Exceptions
#
# *************************************************************************************************

class TabCompilerException(Exception):
	def __init__(self,message):
		self.message = message

# *************************************************************************************************
#
#											Note Class
#
# *************************************************************************************************

class Note:
	def __init__(self,noteDefinition,instrument,capo = 0):
		self.instrument = instrument 										# save instrument type.
		noteDefinition = noteDefinition.upper().replace(" ","") 			# upper case note definition, no spaces
		self.fretting = [] 													# fretting.
		while noteDefinition!="" and Note.FRETS.find(noteDefinition[0])>=0: # while some note data present.
			fretPosition = Note.FRETS.find(noteDefinition[0]) - 1 			# convert to fretting position.
			if fretPosition < capo and fretPosition != -1:					# check not before the Capo.
				raise TabCompilerException("Fretting before Capo position")
			noteDefinition = noteDefinition[1:]								# drop that fret note.
			if not self.instrument.isChromatic() and fretPosition >= 0:		# convert to chromatic position (not nostrum)
				fretPosition = self.toChromatic(fretPosition)				# if chromatic
				if noteDefinition != "" and noteDefinition[0] == '+':		# is it a + diatonic ?
					fretPosition += 1 										# advance one chromatic equivalent
					noteDefinition = noteDefinition[1:] 					# drop the '+'
			self.fretting.append(fretPosition)								# add the note definition.

		if len(self.fretting) == 0:											# validate the number of frets.
			raise TabCompilerException("No fretting at all provided")
		if len(self.fretting) > self.instrument.getStringCount():
			raise TabCompilerException("Too many frets in note definition")

		while len(self.fretting) < self.instrument.getStringCount():		# left pad with no strum
			self.fretting.insert(0,-1)
		if self.instrument.isHighestStringFirst():							# we encode with lowest string first
			self.fretting.reverse()

		self.qbLength = 4 													# length of note.
		for modifier in noteDefinition:										# work through all the modifiers
			if modifier == "O":												# O extra beat
				self.qbLength += 4
			elif modifier == "-":											# - lose half beat
				self.qbLength -= 2
			elif modifier == "=":											# = lose 3/4 of beat
				self.qbLength -= 3
			elif modifier == '.':											# . increase by half
				self.qbLength = int(self.qbLength * 3 / 2)
			else:															# otherwise we have no clue.
				raise TabCompilerException("Unknown length modifier")

		if self.qbLength <= 0:												# too short
			raise TabCompilerException("Bad note length")				

		#print(self.fretting,self.qbLength,self.render())

	def getLength(self):
		return self.qbLength / 4

	def getChromaticFretting(self):
		return self.fretting

	def toChromatic(self,pos):
		return Note.TOCHROMATIC[pos % 7] + int(pos / 7) * 12

	def render(self):
		return "".join([chr(x+97) if x >= 0 else "-" for x in self.fretting])+":"+chr(self.qbLength+97)

Note.FRETS = "&0123456789TLWHUVX"											# identifiers for frets -1 .. 16

Note.TOCHROMATIC = [0,2,4, 5,7,9,10 ]										# Diatonic to Chromatic conversion.
#					D E F# G A B C

# *************************************************************************************************
#
#									Instrument Information Objects
#
# *************************************************************************************************

class MountainDulcimer:
	def getStringCount(self):
		return 3
	def isHighestStringFirst(self):
		return False
	def isChromatic(self):
		return False

# *************************************************************************************************
#
#												Bar Class
#
# *************************************************************************************************

class Bar:
	def __init__(self,definition,beats,instrument,capo = 0):
		self.notes = []														# note objects
		self.labels = [] 													# label texts.
		qbTotal = 0 														# check total length

		for part in [x for x in definition.split(" ") if x != ""]:			# sub parts.
			if part[0] == "[":												# label
				if part[-1] != "]":											
					raise TabCompilerException("Missing ] on label")
				self.labels.append(part[1:-1].strip().lower())
			else:
				self.notes.append(Note(part,instrument,capo))
				qbTotal += self.notes[-1].getLength()
				if len(self.labels) < len(self.notes):						# empty label if required.
					self.labels.append(None)

		if len(self.labels) > len(self.notes):								# too many labels.
			raise TabCompilerException("Unused labels in bar")
		if qbTotal > beats: 												# too many notes in bar.
			raise TabCompilerException("Bar is too long")
		
	def render(self):
		render = ""
		for i in range(0,len(self.notes)):									# for each pair
			if render != "": 												# add seperator if required
				render += ";"
			if self.labels[i] is not None:									# add label if exists
				render += "["+self.labels[i]+"];"
			render += self.notes[i].render() 								# add note
		return render

# *************************************************************************************************
#
#											Compiler Class
#
# *************************************************************************************************

class Compiler:
	def __init__(self):
		pass

	def compile(self,streamIn,streamOut,instrument):
		self.assignments = {} 												# copy assignments default
		for k in Compiler.DEFAULTS.keys():
			self.assignments[k] = Compiler.DEFAULTS[k]

		self.src = [x for x in streamIn.readlines()]						# read in source file.
		self.src = [x if x.find("#") < 0 else x[:x.find("#")] for x in self.src] # comments
		self.src = [x.replace("\t"," ").strip() for x in self.src]			# spaces & tabs

		for ass in [x for x in self.src if x.find(":=") >= 0]:				# pick out assignments
			ass2 = [x.strip().lower() for x in ass.split(":=")]				# split into parts
			if len(ass2) != 2 or ass2[0] not in self.assignments:
				raise TabCompilerException("Bad assignment "+ass)
			self.assignments[ass2[0]] = ass2[1]								# update assignments

		self.bars = []
		for n in range(0,len(self.src)):									# work through source
			if self.src[n] != "" and self.src[n].find(":=") < 0:			# music data only
				for barSrc in [x.strip() for x in self.src[n].split("|")]:	# divide into bars
					if barSrc != "":										# non empty bars
						try:
							bar = Bar(barSrc,int(self.assignments["beats"]),instrument,int(self.assignments["capo"]))
							self.bars.append(bar)
						except TabCompilerException as err:
							raise TabCompilerException(err.message+" @ "+str(n+1))

		keys = [x for x in self.assignments.keys()]							# get sorted assignment key list
		keys.sort()
		streamOut.write("{\n")
		for k in keys:														# render assignments
			streamOut.write('    "{0}":"{1}",\n'.format(k,self.assignments[k]))
		streamOut.write('    "bars":[\n')									# render bars
		streamOut.write(",\n".join(['        "'+x.render()+'"' for x in self.bars]))
		streamOut.write("\n    ]\n}\n")

		 	
Compiler.DEFAULTS = { 	"beats":"4","speed":"100", "title":"unknown", \
						"composer":"unknown","translator":"unknown","instrument":"", \
						"tuning":"","capo":"0" }
md = MountainDulcimer()
cm = Compiler()

cm.compile(open("waterbound.tab"),sys.stdout,md)
cm.compile(open("waterbound.tab"),open("../app/music.json","w"),md)
