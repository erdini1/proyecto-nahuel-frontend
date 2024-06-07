import { Button } from "@/components/ui/button"
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"

export function TasksHome() {
  return (
    (
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">

          {/* ---- Empleados ----- */}

          <div className="flex items-center align-middle">
            <h1 className="font-semibold text-lg md:text-2xl">Empleados</h1>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Crear usuario</CardTitle>
                <CardDescription>
                  Crea un nuevo usuario para asignarle tareas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Crear usuario
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Modificar usuario</CardTitle>
                <CardDescription>Modifica la información de un usuario.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Modificar Usuario
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Eliminar usuario</CardTitle>
                <CardDescription>Elimina un usuario de la base de datos.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Eliminar Usuario
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* ---- Tareas ----- */}
          <div className="flex items-center align-middle">
            <h1 className="font-semibold text-lg md:text-2xl">Tareas</h1>
            <Button className="ml-auto" size="sm">
              Crear Tareas
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Asignar Tareas</CardTitle>
                <CardDescription>Asigna tareas a los empleados.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Asignar Tareas
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Ver Tareas por usuario</CardTitle>
                <CardDescription>Ver las tareas asignadas a un usuario en específico.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Ver Tareas por usuario
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Tareas asignadas a varios usuarios</CardTitle>
                <CardDescription>Ver las tareas asignadas a varios usuarios.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Tareas asignadas a varios usuarios
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* ---- Caja ---- */}

          <div className="flex items-center align-middle">
            <h1 className="font-semibold text-lg md:text-2xl">Caja</h1>
            <Button className="ml-auto" size="sm">
              Crear Tareas
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Asignar Tareas</CardTitle>
                <CardDescription>Asigna tareas a los empleados.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Asignar Tareas
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Ver Tareas por usuario</CardTitle>
                <CardDescription>Ver las tareas asignadas a un usuario en específico.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Ver Tareas por usuario
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Tareas asignadas a varios usuarios</CardTitle>
                <CardDescription>Ver las tareas asignadas a varios usuarios.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Tareas asignadas a varios usuarios
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>)
  );
}
