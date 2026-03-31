import SupervisorForm from "@/components/SupervisorForm";

export default function NewSupervisorPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">監修者新規登録</h2>
      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
        <SupervisorForm />
      </div>
    </div>
  );
}
