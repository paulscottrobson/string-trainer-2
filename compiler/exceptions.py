# ***********************************************************************************************************
#
#												Error Class
#
# ***********************************************************************************************************

class CompilerException(Exception):
	def __init__(self,message):
		self.message = message
	def getMessage(self):
		return self.message
