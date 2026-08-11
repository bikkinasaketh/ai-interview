import "./Contact.css";

function Contact() {

const submitForm=(e)=>{
e.preventDefault();
alert("✅ Message Sent Successfully!");
}

return(

<section className="contact">

<h1>Contact Us</h1>

<form onSubmit={submitForm}>

<input
type="text"
placeholder="Your Name"
required
/>

<input
type="email"
placeholder="Your Email"
required
/>



<textarea
rows="6"
placeholder="Your Message"
required
></textarea>

<button>
Send Message
</button>

</form>

</section>

)

}

export default Contact;