import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from 'next/link'; // Import the Link component
import styles from './styles.css';
const page = async () => {
    const session = await getServerSession(authOptions);
    if(session?.user){
        return (
<div className="pageContainer">
  <div className="adminPage">
    <h2 className="centerMsg">Admin page - welcome back {session?.user.username}</h2>
    <Link href="/home">
      <button className="btn">Go to Home</button>
    </Link>
    <div className="content">
    <div className="buttons">
      <button className="btn">FAQs</button>
      <button className="btn">How the System Works</button>
      <button className="btn">Documentation</button>
      <button className="btn">Be a Pronsumer today</button>
    </div>
    </div>
    <div className="footer">
      <div className="footerLeft">
        <p>Contact Us:</p>
        <p>Email: tafadzwavavi@gmail.com</p>
        <p>Phone: +263 774 084 265</p>
      </div>
      <div className="footerRight">
        <a href="https://www.facebook.com/yourpage" target="_blank" rel="noopener noreferrer">Facebook</a>
      </div>
    </div>

  </div>
</div>

        );
    }

    return <h2>Please login to see this admin page</h2>
};

export default page;
