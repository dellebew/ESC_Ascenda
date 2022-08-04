import NavBar from "../../components/navbar/Navbar"



import "./About.css"


const About = () => {

    
    return (
        <div className="whole-container">
            <NavBar/>
            <div class="parallax">
                <div class="parallax__layer parallax__layer__0">
                    <img src="https://github.com/samdbeckham/blog/blob/master/dev/_assets/images/articles/firewatch/layer_0.png?raw=true" />
                </div>
                <div class="parallax__layer parallax__layer__1">
                    <img src="https://github.com/samdbeckham/blog/blob/master/dev/_assets/images/articles/firewatch/layer_1.png?raw=true" />
                </div>
                <div class="parallax__layer parallax__layer__2">
                    <img src="https://github.com/samdbeckham/blog/blob/master/dev/_assets/images/articles/firewatch/layer_2.png?raw=true" />
                </div>
                <div class="parallax__layer parallax__layer__3">
                    <img src="https://github.com/samdbeckham/blog/blob/master/dev/_assets/images/articles/firewatch/layer_3.png?raw=true" />
                </div>
                <div class="parallax__layer parallax__layer__4">
                    <img src="https://github.com/samdbeckham/blog/blob/master/dev/_assets/images/articles/firewatch/layer_4.png?raw=true" />
                </div>
                <div class="parallax__layer parallax__layer__5">
                    <img src="https://github.com/samdbeckham/blog/blob/master/dev/_assets/images/articles/firewatch/layer_5.png?raw=true" />
                </div>
                <div class="parallax__layer parallax__layer__6">
                    <img src="https://github.com/samdbeckham/blog/blob/master/dev/_assets/images/articles/firewatch/layer_6.png?raw=true" />
                </div>
                <div class="parallax__cover"></div>
            </div>
            <header className="description">
                <p>Problem Statement:</p><br/>
                <p>Ascenda Loyalty provides white-labelled hotel booking platforms on behalf of banks,</p>
                <p>airlines and loyalty programs worldwide. Global customers can earn and redeem hotel night</p>
                <p>stays in these platforms using accumulated points from their spendings. Some features in these platforms</p>
                <p>include text-based autocomplete search, aggregating hotel / destination searches from multiple suppliers,</p>
                <p>storage of booking data, etc.</p><br/><br/> 

                <p>Made by:</p>
                <p>Soh Pei Xuan     1005552</p>
                <p>Adelle Chan		1005418</p>
                <p>Guo Yuchen       1004885</p>
                <p>Nicholas Goh		1005194</p>
                
            </header>
        </div>
    )
}

export default About