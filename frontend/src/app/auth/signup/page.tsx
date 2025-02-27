import SignupForm from "./signup-form";

export default function SignupPage() {
  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-100">
        <div className="col-12 col-md-8 col-lg-6 mx-auto">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
