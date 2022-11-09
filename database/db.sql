
Create database periodicoSpringfield;

Use periodicoSpringfield;

Create table administradores (
    id int(10) primary key auto_increment,
    nombre varchar(50) not null,
    apellidos varchar (50) not null,
    correo varchar(70) not null,
    usuario varchar(50) not null,
    contraseña varchar(60) not null
);

Create table columnistas (
    id int(10) primary key auto_increment,
    nombre varchar(50) not null,
    apellidos varchar (50) not null,
    correo varchar(70) not null,
    usuario varchar(50) not null,
    contraseña varchar(60) not null
);