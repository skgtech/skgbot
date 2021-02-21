/**
 * @fileoverview Handler of the canonical viewer object.
 * To be used by all controllers and entities for identity management and
 * audit logging purposes.
 */

const viewerMidd = (module.exports = {});

/**
 * Returns the canonical viewer object. To be used by all controllers and
 * entities for identity management.
 *
 * @param {Request} req Express request.
 * @param {Object=} optUser if user is defined add it.
 * @return {Viewer} A viewer object.
 */
viewerMidd.getViewer = (req, optUser) => {
  return {
    isAuthed: !!optUser,
    req,
    user: optUser || null,
  };
};

/**
 * Viewer middleware, creates and attaches the viewer on the request object.
 *
 * @param {Request} req Express request.
 * @param {Response} res Express response.
 * @param {function} next Error handler.
 */
viewerMidd.use = (req, res, next) => {
  const viewer = viewerMidd.getViewer(req, req.user);

  req.viewer = viewer;

  next();
};
