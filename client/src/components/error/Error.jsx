import "./error.css"

export default function Error(props) {

    const errorImg = props.img ? props.img : "/404-error.png"

    const style = {
        backgroundImage:`url(${process.env.PUBLIC_URL+ errorImg})`,
        backgroundColor: 'rgba(0, 0, 0, 0.834)',
        backgroundPosition: 'center',
        backgroundRepeat:'no-repeat'}

    return (
        <div style={style} className="error-container"/>
    )
}
