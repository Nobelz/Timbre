"use client";

import { useSearchParams, useRouter } from "next/navigation";
import useRefreshToken from "../../../hooks/useRefreshToken";
import { Spinner, Container, Row, Col } from 'react-bootstrap';
import styles from '../../styles/loading.module.css';

export default function Callback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const error = searchParams.get('error');
  if (error) {
    router.push('/');
  } else {
    const code = searchParams.get('code');
    useRefreshToken(String(code));
  }

  return (
    <Container>
      <Row style={{paddingTop: '15%'}}> 
        <Col>
          <div class={`${styles.center}`}>
          <div class={`${styles.wave}`}></div>
          <div class={`${styles.wave}`}></div>
          <div class={`${styles.wave}`}></div>
          <div class={`${styles.wave}`}></div>
          <div class={`${styles.wave}`}></div>
          <div class={`${styles.wave}`}></div>
          <div class={`${styles.wave}`}></div>
          <div class={`${styles.wave}`}></div>
          <div class={`${styles.wave}`}></div>

        </div>
        <link href='https://fonts.googleapis.com/css?family=Lexend' rel='stylesheet'/>
          <h2 className="mt-3"style={{fontFamily: 'Lexend, sans-serif', 
                        fontSize: 'x-large', 
                        background: 'white', 
                        color: '#083686',
                        textAlign: 'center'
                    }}> Hang tight! We're logging you in.</h2>
        </Col>
      </Row>
    </Container>
  );
}