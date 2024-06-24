import "./Loading.css";

export function LoadingPage() {
  return (
    <div id="loading-page">
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
