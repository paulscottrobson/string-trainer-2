# ***********************************************************************************************************
# ***********************************************************************************************************
#
#												  NOTE
#
# ***********************************************************************************************************
# ***********************************************************************************************************

from exceptions import CompilerException

# ***********************************************************************************************************
#
#												Note Class
#
# ***********************************************************************************************************

class Note:
	def __init__(self,noteList):
		self.notes = noteList
		self.qbLength = 4

	def processModifiers(self,modifiers):
		modifiers = modifiers.upper()
		for mod in modifiers:
			if mod == "O":
				self.qbLength += 4
			elif mod == ".":
				self.qbLength = int(self.qbLength * 3 / 2)
			elif mod == "-":
				self.qbLength -= 2
			elif mod == "=":
				self.qbLength -= 3
			else:
				raise CompilerException("Unknown modifier '"+mod+"'")
		if self.qbLength <= 0:
			raise CompilerException("Note is zero or less length")				

	def render(self):
		return ("".join(["{0:02}".format(x) for x in self.notes]))+(":{0:02}".format(self.qbLength))

	@staticmethod
	def getModifiers():
		return "Oo.-="

