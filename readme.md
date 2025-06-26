# Backend para Agendamiento de Citas Médicas

Este proyecto implementa el backend para una aplicación de agendamiento de citas, utilizando una arquitectura serverless en AWS. La solución está diseñada para ser escalable, resiliente y eficiente, procesando las solicitudes de manera asíncrona para ofrecer una respuesta inmediata al usuario final.

## Decisión de Arquitectura

La arquitectura seleccionada se basa en un patrón de procesamiento asíncrono y orientado a eventos, lo cual es ideal para flujos de trabajo donde la respuesta inmediata no depende de la finalización de todo el proceso.

## Guía de Uso

### Prerrequisitos

-   Node.js (v18 o superior)
-   `pnpm` (o `npm`/`yarn`)
-   Serverless Framework (`npm install -g serverless`)
-   AWS CLI configurada

### Configuración Inicial

1.  Clona el repositorio:
    ```bash
    git clone https://github.com/harolrodriguez/reto-aws
    cd reto-aws
    ```

2.  Instala las dependencias:
    ```bash
    pnpm install
    ```

3.  Configura tus credenciales de AWS. Se recomienda usar un perfil para aislar la configuración:
    ```bash
    aws configure --profile reto-aws
    ```
    El proyecto está preconfigurado para usar el perfil `reto-aws`.

### Despliegue en AWS

Para desplegar la infraestructura completa en tu cuenta de AWS, ejecuta:
```bash
pnpm run deploy
```
El comando se encargará de compilar el código, empaquetar y crear todos los recursos en la nube.

### Pruebas Unitarias

Las pruebas unitarias validan la lógica de negocio de los handlers de forma aislada, sin necesidad de conectarse a servicios de AWS. Para ejecutarlas:
```bash
pnpm test
```

## Documentación de la API (Swagger UI)

Este proyecto genera automáticamente una documentación interactiva de la API usando Swagger UI.

`https://editor.swagger.io/`

Pegar el archivo swagger.json