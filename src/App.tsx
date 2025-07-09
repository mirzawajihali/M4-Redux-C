import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './layout/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from './layout/Footer';

const App = () => {
  return (
    <div>
      <Navbar/>
      <Outlet/>
      <Footer/>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default App;