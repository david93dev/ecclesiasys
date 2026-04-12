export const EmptyState = ({
  title = "Nenhum dado encontrado",
  description = "Filtre novamente ou cadastre para obter informações",
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>

      <p className="mt-1 text-sm">{description}</p>

      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
};