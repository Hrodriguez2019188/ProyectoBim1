import Post from '../post/post.js';
import userHasComment from '../user/userHasComment.js';

export const postPublicacion = async (req, res) => {
    try {
        const { titulo, categoria, descripcion } = req.body;
        const post = new Post({
            titulo,
            categoria,
            descripcion,
            user: req.usuario._id
        });
        await post.save();
        res.status(201).json({
            msg: 'Se publicó la publicación',
            post
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Hable con el administrador',
        });
    }
};

export const putPublicacion = async (req, res) => {
    try {
        const { createdAt } = req.params; // Cambia el nombre del parámetro al campo adecuado
        const { titulo, categoria, descripcion } = req.body;

        const post = await Post.findOne({ createdAt }); // Busca la publicación por su campo de createdAt
        if (!post) {
            return res.status(404).json({
                msg: 'Publicación no encontrada',
            });
        }
        if (post.user.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({
                msg: 'No puedes editar esta publicación',
            });
        }

        post.titulo = titulo;
        post.categoria = categoria;
        post.descripcion = descripcion;
        await post.save();

        res.status(200).json({
            msg: 'Publicación editada',
            post
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Hable con el administrador',
        });
    }
};

export const addComment = async (req, res) => {
    try {
        const { userId } = req.params;
        const { postId, titulo, descripcion } = req.body; // Agrega título y descripción desde el cuerpo de la solicitud

        // Crea un nuevo comentario utilizando el modelo userHasComment
        const nuevoComentario = new userHasComment({
            user: userId,
            post: postId,
            titulo: titulo, // Asigna el título proporcionado
            descripcion: descripcion // Asigna la descripción proporcionada
        });

        await nuevoComentario.save(); // Guarda el nuevo comentario en la base de datos

        res.status(200).json({
            msg: 'Comentario enviado',
            comentario: nuevoComentario, // Devuelve el comentario creado
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Hable con el administrador',
        });
    }
};

export const getAllPostsWithComments = async (req, res) => {
  try {
      // Buscar todos los posts
      const posts = await Post.find();

      // Iterar sobre cada post y buscar los comentarios asociados por el ID de PostHasComment


      res.status(200).json({
          msg: 'Posts encontrados con sus comentarios',
          posts,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          msg: 'Hable con el administrador de los post',
      });
  }
};
