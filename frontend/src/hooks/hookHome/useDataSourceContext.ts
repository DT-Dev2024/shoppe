import { useContext } from "react";
import { DataSourceContext } from "src/contexts";

function useDataSourceContext() {
  const dataSourceContext = useContext(DataSourceContext);
  return dataSourceContext;
}

export default useDataSourceContext;
