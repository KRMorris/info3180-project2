#! /usr/bin/env python
import logging
from app import app
app.run(debug=True,host="0.0.0.0",port=8082)

'''app.logger.basicConfig(filename='example.log',level=logging.DEBUG)
app.logger.debug('This message should go to the log file')
logging.info('So should this')
app.logger.warning('%s before you %s', args, 'leap!')'''
