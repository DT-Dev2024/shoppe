import { useEffect } from "react";
import { Container } from "src/components/old";
import { HOME_PAGE_TITLE } from "src/constants";
import { updateWebsiteTitle } from "src/helpers";
function Home() {
  useEffect(() => updateWebsiteTitle(HOME_PAGE_TITLE), []);

  return <Container />;
}

export default Home;
