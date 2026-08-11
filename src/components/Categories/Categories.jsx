import "./Categories.css";
import { Link } from "react-router-dom";
import {
  FaJava,
  FaPython,
  FaReact,
  FaDatabase,
  FaHtml5,
  FaUserTie
} from "react-icons/fa";

function Categories() {

  const categories = [

    {
      icon:<FaJava/>,
      title:"Java",
      path:"/topics"
    },

    {
      icon:<FaPython/>,
      title:"Python",
      path:"/topics"
    },

    {
      icon:<FaReact/>,
      title:"React",
      path:"/topics"
    },

    {
      icon:<FaHtml5/>,
      title:"HTML & CSS",
      path:"/topics"
    },

    {
      icon:<FaDatabase/>,
      title:"Database",
      path:"/topics"
    },

    {
      icon:<FaUserTie/>,
      title:"HR Interview",
      path:"/topics"
    }

  ];

  return(

<section className="categories">

<h2>Interview Categories</h2>

<p>
Choose your interview category and start practicing.
</p>

<div className="category-grid">

{
categories.map((item,index)=>(

<Link
to={item.path}
className="category-card"
key={index}
>

<div className="category-icon">
{item.icon}
</div>

<h3>{item.title}</h3>

<span>Start Practice →</span>

</Link>

))
}

</div>

</section>

  )

}

export default Categories;