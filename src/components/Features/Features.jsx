import "./Features.css";
import {
  FaRobot,
  FaClock,
  FaChartLine,
  FaLaptopCode
} from "react-icons/fa";

function Features() {

  const features = [

    {
      icon:<FaRobot/>,
      title:"AI Powered",
      desc:"Practice interviews with intelligent AI."
    },

    {
      icon:<FaClock/>,
      title:"Real-Time Practice",
      desc:"Improve speed with timed interview sessions."
    },

    {
      icon:<FaChartLine/>,
      title:"Performance Analysis",
      desc:"Track your progress with score reports."
    },

    {
      icon:<FaLaptopCode/>,
      title:"Technical Questions",
      desc:"Practice Java, React, Python, SQL and more."
    }

  ];

  return(

<section className="features">

<h1>Why Choose AI Interview Coach?</h1>

<div className="feature-grid">

{
features.map((item,index)=>(

<div className="feature-card" key={index}>

<div className="icon">
{item.icon}
</div>

<h3>{item.title}</h3>

<p>{item.desc}</p>

</div>

))
}

</div>

</section>

)

}

export default Features;