import Link from "next/link";
import styled from "styled-components";

export default function Blogs() {
  return (
    <BlogContainer>
      <h4>Informative blogs listed by secure shield</h4>
      <BlogsMain>
        <BlogsCard>
          <div className="label"></div>
          <h3>
            How IP and Email Analysis Can Strengthen Your Cybersecurity Strategy
          </h3>
          <p>Questions Addressed</p>
          <h5>
            How can real-time IP and email analysis help prevent cyber attacks
            before they happen?
          </h5>
          <Link href="#" className="border-bg-btn">
            Read More 5 MIN Read
          </Link>
        </BlogsCard>
        <BlogsCard>
          <div className="label"></div>
          <h3>
            How IP and Email Analysis Can Strengthen Your Cybersecurity Strategy
          </h3>
          <p>Questions Addressed</p>
          <h5>
            What are the biggest cybersecurity threats businesses face, and how
            can automated threat detection help?
          </h5>
          <Link href="#" className="border-bg-btn">
            Read More 10 MIN Read
          </Link>
        </BlogsCard>
      </BlogsMain>
    </BlogContainer>
  );
}

const BlogContainer = styled.div`
  padding: 100px 150px;
  background-color: rgb(9, 23, 23);
  width: 100%;
  z-index: 1000;
  h4 {
    font-family: font2-300;
    color: var(--white-smoke);
    font-size: 35px;
    margin-bottom: 3rem;
  }
`;

const BlogsMain = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
`;

const BlogsCard = styled.div`
  position: relative;
  padding: 64px 48px;
  border: 1px solid var(--white-smoke);
  border-radius: 7px;

  .label {
    position: absolute;
    top: 0%;
    left: 0%;
    height: 10px;
    width: 100%;
    background-color: var(--white-smoke);
    border-top-left-radius: 7px;
    border-top-right-radius: 7px;
  }
  h3 {
    font-family: font2-300;
    font-size: 32px;
    line-height: 1.4;
    color: var(--white-smoke);
    margin-bottom: 2.5rem;
  }
  p {
    font-size: 13px;
    font-family: font1;
    color: var(--white-smoke);
    margin-bottom: 1rem;
  }
  h5 {
    font-size: 18px;
    font-family: font1;
    color: var(--white-smoke);
    margin-bottom: 3rem;
  }
`;
