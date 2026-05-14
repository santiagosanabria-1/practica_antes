def leerDatos (totalNotas, finMateria):
    notaAcum = 0
    for i in range (totalNotas):
        while(True):
            nota = int (input(f'Ingrese nota de {finMateria} [{i+1}]:'))
            if ((nota>=0) and (nota<=100)):
                notaAcum += nota
                break
            else:
                print('La nota tiene que estar entre 0 Y 100')
                
    return notaAcum

MATEMATICAS = 3
INGLES = 2
PROGRAMACION = 4
notaFinal = 0
notaMatematicas = 0
notaIngles = 0
notaProgramacion = 0
notaMatematicas = leerDatos(MATEMATICAS, 'Matematicas')
notaIngles = leerDatos(INGLES, 'Ingles')
notaProgramacion = leerDatos(PROGRAMACION, 'Programacion')
 
notaFinal = ((notaProgramacion/PROGRAMACION)*0.6) + ((notaMatematicas/MATEMATICAS)*0.25) + ((notaIngles/INGLES)*0.15)
print (f'La nota final es {notaFinal}')