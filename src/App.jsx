import { BrowserRouter, Route, Routes } from "react-router"
import Layout from "@/components/Layout"
import Appointments from "@/pages/Appointments"
import Book from "@/pages/Book"
import DoctorDetail from "@/pages/DoctorDetail"
import Doctors from "@/pages/Doctors"
import Home from "@/pages/Home"
import NotFound from "@/pages/NotFound"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Every page renders inside Layout's <Outlet /> */}
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="doctors/:id" element={<DoctorDetail />} />
          <Route path="book" element={<Book />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
