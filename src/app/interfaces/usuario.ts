export interface Usuario {
    id: string;
    nombre: string;
    activo: boolean;
    rol: Rol;
}


export interface Rol {
    id: string;
    nombre: string;
}

//esto es un ejemplo para probar sourcetree