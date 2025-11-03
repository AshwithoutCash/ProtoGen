# Minimal WSGI app to verify Vercel Python functions are building

def app(environ, start_response):
    start_response('200 OK', [('Content-Type', 'application/json')])
    return [b'{"status":"ok","message":"python function deployed"}']
