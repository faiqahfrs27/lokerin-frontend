import { Link } from "react-router";
import { fadeUp } from "../../utils/AnimationStyle";

function RegisterCompanyFooter() {
  return (
    <>
      <p style={fadeUp(800)} className="auth-foot">
        Sudah punya akun?{" "}
        <Link to="/login" className="link strong">Masuk</Link>
      </p>
      <p style={fadeUp(850)} className="auth-foot">
        Kamu pencari kerja?{" "}
        <Link to="/register" className="link strong">Daftar sebagai User</Link>
      </p>
    </>
  );
}

export default RegisterCompanyFooter;