# ***********************************************************************************************************
# ***********************************************************************************************************
#
#												INSTRUMENTS
#
# ***********************************************************************************************************
# ***********************************************************************************************************

import re
from exceptions import CompilerException
from note import Note 

# ***********************************************************************************************************
#
#										  Base Instrument Class
#
# ***********************************************************************************************************

class BaseInstrument:
	def __init__(self,capoPosition = 0):
		self.capoPosition = 0
		self.setup()

	# set up routine
	def setup(self):
		pass

	# Inverted is normally just the dulcimer - 301 has 3 as the lowest which is the normal.
	def isInverted(self):
		return False

	# For diatonic instrument ? other non chromatic ?
	def convertToChromatic(self,fret):
		return fret

	# Create a note from the given definition (sequence of fret positions)
	def createNote(self,definition):
		self.definition = definition.upper()
		# remove modifiers from the end
		modifiers = ""
		while self.definition != "" and Note.getModifiers().find(self.definition[-1]) >= 0:
			modifiers = self.definition[-1]+modifiers 
			self.definition = self.definition[:-1]
		# get a note set from it
		notes = self.extractNotes()
		# might just be info e.g. the string switchers on Mandolin
		if notes is None:
			return None
		# make lowest note first.
		if not self.isInverted():
			notes.reverse()
		# fill notes with rest on voices.
		while len(notes) < self.getVoices():
			notes.insert(0,99)
		# check too many notes.
		if len(notes) > self.getVoices():
			raise CompilerException("More fretting positions than notes '"+definition+"'")
		# create note and modify the length.
		note = Note(notes)
		note.processModifiers(modifiers)
		return note

	def extractNotes(self):
		# extract note(s) from the rest.
		notes = []
		fretting = self.extractNoteElement() 
		while fretting is not None:
			if fretting != 98:
				if fretting < 99:
					notes.append(self.convertToChromatic(fretting))
				else:
					notes.append(fretting)
			fretting = self.extractNoteElement()
		return notes 

	# extract a note from fretting letters.
	def extractNoteElement(self):
		if self.definition == "":
			return None
		fret = BaseInstrument.FRETLETTERS.find(self.definition[0])
		if fret < 0:
			raise CompilerException("Unknown fretting position '"+self.definition[0]+"'")
		self.definition = self.definition[1:]
		return 99 if fret == 0 else fret-1

	# convert diatonic offset to chromatic one.
	def toChromatic(self,diatonic):
		fret = BaseInstrument.TOCHROMATIC[int(diatonic) % 7]
		fret = fret + int(diatonic/7) * 12
		if diatonic != int(diatonic):
			fret += 1
		return fret

# Represents rest and fretting from 0 to 19.
BaseInstrument.FRETLETTERS = "&0123456789TLWHUFXVGN"	

# Diatonic to Chromatic conversion.
BaseInstrument.TOCHROMATIC = [0,2,4, 5,7,9,10 ]										
#							  D E F# G A B C

# ***********************************************************************************************************
#
#										   Dulcimer Instrument Class
#
#											(with some explanations)
#
#	For non string instruments, think of them as multi voice instruments and the fretting as the note
#	played. So for a harmonica, say, there might be 3-5 voices and the fretting is the hole, modified
#	by bending and blow/draw. In the end the result of the compiler is just "play these notes now".
# ***********************************************************************************************************

class Dulcimer(BaseInstrument):
	#
	#	Dulcimer has three strings
	#
	def getVoices(self):
		return 3
	# 
	#	Dulcimer tab is upside down, with the lowest note at the top.
	#
	def isInverted(self):
		return True
	#
	#	Dulcimers are diatonically tabbed so we convert fret positions to chromatic notes
	#
	def convertToChromatic(self,fret):
		return self.toChromatic(fret)
	#
	#	However, dulcimers can have a + fret, indicating a semitone difference - so we 
	#	extend the note extractor to add this 0.5 value if it is followed by a +
	#
	def extractNoteElement(self):
		element = BaseInstrument.extractNoteElement(self)
		if element is not None:
			if self.definition != "" and self.definition[0] == '+':
				element += 0.5
				self.definition = self.definition[1:]
		return element
	#
	#	And we need an instrument name and subtype
	#
	def getName(self):
		return "dulcimer"
	def getSubtype(self):
		return ""

# ***********************************************************************************************************
#
#												Harmonica
#
# ***********************************************************************************************************

class Harmonica(BaseInstrument):

	def getName(self):
		return "harmonica"
	def getSubtype(self):
		return ""
	def getVoices(self):
		return 3

	def extractNoteElement(self):
		#print("<"+self.definition+">")
		if self.definition == "":
			return None
		if self.definition[0] == "&":
			self.definition = self.definition[1:]
			return 99
		draw = False
		if self.definition[0] == "-":
			draw = True
			self.definition = self.definition[1:]
		m = re.match("^([0-9]+)[/,]?(.*)$",self.definition)
		if m is None:
			raise CompilerException("Unknown note '"+self.definition+"'")
		noteID = int(m.group(1))
		self.definition = m.group(2)
		if draw:
			return Harmonica.DRAW[noteID-1]+1
		else:
			return Harmonica.BLOW[noteID-1]+1

Harmonica.BLOW = [  0, 4, 7,12,16,19,24,28,31,36 ]
Harmonica.DRAW = [  2, 7,11,14,17,21,23,26,29,33 ]

# ***********************************************************************************************************
#
#												Mandolin
#
# ***********************************************************************************************************

class Mandolin(BaseInstrument):

	def getName(self):
		return "mandolin"
	def getSubtype(self):
		return ""
	def getVoices(self):
		return 4

	def setup(self):
		self.currentString = 3
		self.shiftedString = None 

	def extractNotes(self):

		while self.definition != "" and "GDAE".find(self.definition[0]) >= 0:
			self.currentString = "EADG".find(self.definition[0])
			self.shiftedString = self.currentString
			self.definition = self.definition[1:]

		if self.definition == "":
			return None		
		if self.definition[0] == '&':
			self.definition = self.definition[1:]
			return [99,99,99,99]

		#print("<"+self.definition+">",self.currentString)
		fret = BaseInstrument.FRETLETTERS.find(self.definition[0])
		if fret < 0:
			raise CompilerException("Unknown Fret Position "+self.definition)
		notes = [ 99 ] * self.getVoices()
		notes[self.currentString if self.shiftedString is None else self.shiftedString] = fret - 1
		self.shiftedString = None
		return notes		
