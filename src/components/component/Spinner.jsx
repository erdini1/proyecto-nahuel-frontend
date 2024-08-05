export default function Spinner() {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <div className="border-4 border-gray-900 border-t-transparent rounded-full w-12 h-12 animate-spin" />
          <p className="mt-4 text-gray-900-foreground font-medium">Cargando</p>
        </div>
      </div>
    )
  }