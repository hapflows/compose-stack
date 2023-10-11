from jinja2 import Environment, select_autoescape, PackageLoader

env = Environment(
    loader=PackageLoader("fastapi_server.apps.notifications", "templates"),
    autoescape=select_autoescape(["html", "xml"]),
)


def get_html_from_template(template_path: str, vars: dict):
    template = env.get_template(f"{template_path}.html")
    html = template.render(**vars)
    return html
