import { renderToString } from "react-dom/server";
import App from "./App";
export { projects, profile } from "./content/portfolio";
export const render = (path: string) => renderToString(<App path={path} />);
