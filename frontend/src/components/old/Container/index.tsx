import {
  Directory,
  FlashSale,
  GiftBanner,
  Outstanding,
  SearchTrending,
  ShopeeMall,
  Slider,
  TodaySuggestion,
  TopSearch,
  UnderFlashSale,
} from "./containers";

function Container() {
  return (
    <div id="container">
      <Slider />
      <GiftBanner />
      <Outstanding />
      <Directory />
      <FlashSale />
      <UnderFlashSale />
      <ShopeeMall />
      <SearchTrending />
      <TopSearch />
      <TodaySuggestion />
    </div>
  );
}

export default Container;
