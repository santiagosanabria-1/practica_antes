
def leerDatos (productos, totalVentas):
    ventasAcum = 0
    for i in range (productos):
        while(True):
            precio = int(input(f'Introduzca el precio {totalVentas} [{i+1}]:'))




CELULARES = 3
AUDIFONOS = 4
ACCESORIOS = 2
total_cel = 0
total_audi = 0
total_accesori = 0
total_cel = leerDatos(CELULARES, 'Celulares')
total_audi = leerDatos(AUDIFONOS, 'Audifonos')
total_accesori = leerDatos(ACCESORIOS, 'Accesorios')


