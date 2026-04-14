export const Loading = ({ text = "Carregando...", fullScreen = false }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${
        fullScreen ? "h-screen" : "h-full py-10"
      }`}
    >
      {/* Spinner */}
      <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin" />

      {/* Texto */}
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );
};