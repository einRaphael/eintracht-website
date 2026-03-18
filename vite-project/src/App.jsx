import Navbar from './components/navbar_dropdown';
import Gallery from './components/gallery';
import './index.css';
import Spielplan from './components/spielplan';

const App = () => {
  return (
      <main>
        <Navbar />
        <Gallery />
        <Spielplan />
      </main>
  )
}
export default App


