import { useEffect } from "react";
import { Container, Footer, Header, MotionPart } from "src/components/old";
import { HOME_PAGE_TITLE } from "src/constants";
import { updateWebsiteTitle } from "src/helpers";
function Home() {
  useEffect(() => updateWebsiteTitle(HOME_PAGE_TITLE), []);

  return (
    <>
      <Header />
      <Container />
      <Footer />
      <MotionPart />
      {/* {showModal && <Modal />} */}
    </>
  );
}

export default Home;
