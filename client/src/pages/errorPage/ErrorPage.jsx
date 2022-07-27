import NavBar from "../../components/navbar/Navbar"
import Error from '../../components/error/Error'

export default function ErrorPage(props) {

    return (
        <div>
            <div><NavBar/></div>
            <div><Error {...props}/></div>
        </div>
    )
}