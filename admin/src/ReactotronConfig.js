import Reactotron from 'reactotron-react-js'
import { reactotronRedux } from 'reactotron-redux'
import apisaucePlugin from 'reactotron-apisauce'

const reactotron = Reactotron.configure({ name: 'REACT BASE' })
  .use(
    apisaucePlugin({
      // ignoreContentTypes: /^(image)\/.*$/i   // <--- a way to skip printing the body of some requests (default is any image)
    })
  )
  .use(reactotronRedux())
  .connect()

export default reactotron
