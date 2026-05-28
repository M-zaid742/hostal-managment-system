export default function PaymentsDue({ paymentsDue = [] }) {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <h2 className="h5">Payments Due</h2>
        <ul className="list-unstyled mb-0">
          {paymentsDue.map((payment) => (
            <li key={payment.name} className="d-flex justify-content-between py-2 border-bottom">
              <div>
                <div className="fw-semibold">{payment.name}</div>
                <div className="text-muted small">Due {payment.due}</div>
              </div>
              <span className="fw-semibold text-danger">PKR {payment.amount}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
