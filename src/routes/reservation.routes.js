const express = require("express");
const { body, validationResult } = require("express-validator");
const ReservationController = require("../controllers/ReservationController");
const authFirebase = require("../middlewares/authFirebase"); // 👈 import du middleware

const router = express.Router();

// Middleware de validation
const validateReservation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ erreurs: errors.array() });
    }
    next();
};

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Gestion des réservations
 */

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Ajouter une nouvelle réservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date_reservation
 *               - nbre_personne
 *             properties:
 *               id_restaurant:
 *                 type: string
 *                 example: "64df91bc34ef56gh78ij90kl"
 *               id_hotel:
 *                 type: string
 *                 example: "65df91bc34ef56gh78ij45mn"
 *               date_reservation:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-21T19:30:00Z"
 *               nbre_personne:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Réservation créée avec succès
 *       400:
 *         description: Erreur de validation
 */
router.post(
    "/",
    authFirebase, // protège et ajoute req.user
    [
        body("date_reservation")
            .notEmpty()
            .withMessage("La date est requise")
            .isISO8601()
            .withMessage("Format de date invalide"),
        body("nbre_personne")
            .isInt({ min: 1 })
            .withMessage("Nombre de personnes invalide"),
    ],
    validateReservation,
    ReservationController.createReservation
);

/**
 * @swagger
 * /api/reservations/me:
 *   get:
 *     summary: Récupérer les infos de l'utilisateur connecté
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Infos utilisateur
 */
router.get("/me", authFirebase, ReservationController.getUserInfo);

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Récupérer la liste de toutes les réservations
 *     tags: [Reservations]
 */
router.get("/", ReservationController.getReservations);

/**
 * @swagger
 * /api/reservations/{id}:
 *   put:
 *     summary: Mettre à jour une réservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 */
router.put(
    "/:id",
    authFirebase, // protège la mise à jour
    [
        body("date_reservation").optional().isISO8601().withMessage("date invalide"),
        body("nbre_personne").optional().isInt({ min: 1 }).withMessage("Nombre invalide"),
        body("statut").optional().isIn(["en attente", "confirmée", "annulée"]).withMessage("Statut invalide"),
    ],
    validateReservation,
    ReservationController.updateReservation
);

/**
 * @swagger
 * /api/reservations/{id}:
 *   delete:
 *     summary: Supprimer une réservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:id", authFirebase, ReservationController.deleteReservation);

module.exports = router;
