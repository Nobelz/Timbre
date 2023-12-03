"use client";

import { useSearchParams, useRouter } from "next/navigation";
import useRefreshToken from "../../../hooks/useRefreshToken";
import { Spinner, Container, Row, Col } from 'react-bootstrap';

export default function Callback() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  useRefreshToken(String(code));

  return (
    <Container className="text-center mt-5">
      <Row>
        <Col>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <h2 className="mt-3">Logging you in...</h2>
        </Col>
      </Row>
    </Container>
  );
}