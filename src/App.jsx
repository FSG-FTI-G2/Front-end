import { useRoutes } from "react-router-dom";
import { routes } from "./routes/route";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { theme } from "./utils/theme";

function App() {
  return (
    <MantineProvider theme={theme}>
      <Notifications />
      {useRoutes(routes)}
    </MantineProvider>
  );
}

export default App;
