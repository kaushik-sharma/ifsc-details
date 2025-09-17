export class RazorpayService {
  static readonly getIfscDetails = async (ifsc: string) => {
    return await fetch(`https://ifsc.razorpay.com/${ifsc}`);
  };
}
