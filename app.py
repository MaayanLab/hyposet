import click
import asyncio
import pathlib
from aiohttp import web
from react_supervenn import supervenn

root = pathlib.Path(__file__).parent

def _supervenn(kwargs):
  sets = [set(s) for s in kwargs.pop('sets')]
  return supervenn(sets, **kwargs)

async def async_supervenn(**kwargs):
  return await asyncio.get_running_loop().run_in_executor(None, _supervenn, kwargs)

routes = web.RouteTableDef()

@routes.post('/api/supervenn')
async def route_supervenn(request):
  req = await request.json()
  res = await async_supervenn(**req)
  return web.json_response(data=res)

@routes.get('/')
async def route_index(request):
  return web.FileResponse(root / 'dist' / 'index.html')

routes.static('/', root / 'dist')

app = web.Application()
app.router.add_routes(routes)


if __name__ == '__main__':
  @click.command()
  @click.option('-s', '--path', type=click.STRING)
  @click.option('-l', '--host', type=click.STRING)
  @click.option('-p', '--port', type=click.INT)
  def run(path=None, host=None, port=None):
    web.run_app(app, path=path, host=host, port=port)
  run()
