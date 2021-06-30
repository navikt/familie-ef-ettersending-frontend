import app from "./mock-routes";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import config from "../dev-server/webpack/webpack.dev";
import path from "path";

const port = 8000;
const compiler = webpack(config);
const middleware = webpackDevMiddleware(compiler, {publicPath: config.output.publicPath});

app.use(middleware);
app.use(webpackHotMiddleware(compiler));

console.log(path.join(__dirname, '/../frontend_development/index.html'))

app.get('/*', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(
        middleware.fileSystem.readFileSync(
            path.join(__dirname, '/../frontend_development/index.html')
        )
    );
    res.end();
});

const server = app.listen(port, 'localhost', function onStart(err) {
    if (err) {
        console.log(err);
    }
    console.info('=== mock-server startet på http://localhost:%s/', port);
});

process.on('SIGTERM', function() {
    server.close();
});