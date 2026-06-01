import { Link } from "react-router";
import { fadeUp } from "../../utils/AnimationStyle";

function RegisterFooter() {
  return (
    <>
      <p style={fadeUp(800)} className="auth-foot">
        Sudah punya akun?{" "}
        <Link to="/login" className="link strong">Masuk</Link>
      </p>
      <p style={fadeUp(850)} className="auth-foot">
        Kamu perusahaan?{" "}
        <Link to="/login" className="link strong">Login sebagai Admin</Link>
      </p>
    </>
  );
}

export default RegisterFooter;