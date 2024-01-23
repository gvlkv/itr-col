type Props = {
  isLoading: boolean;
};

export default function SubmitBtn({ isLoading }: Props) {
  return (
    <button type="submit" className="btn btn-primary" disabled={isLoading}>
      {isLoading ? "Submitting..." : "Submit"}
    </button>
  );
}
