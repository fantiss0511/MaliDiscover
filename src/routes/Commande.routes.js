/*
const express = require("express");
const router = express.Router();
const CommandeController = require("../controllers/CommandeController");

/!**
 * @swagger
 * tags:
 *   name: Commandes
 *   description: Gestion des commandes
 *!/

/!**
 * @swagger
 * /api/commandes:
 *   post:
 *     summary: Créer une nouvelle commande
 *     tags: [Commandes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientId
 *               - produits
 *             properties:
 *               clientId:
 *                 type: string
 *                 example: "64df90ab12cd3e4567ef89ab"
 *               produits:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     produitId:
 *                       type: string
 *                       example: "64df91bc34ef56gh78ij90kl"
 *                     quantite:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Commande créée avec succès
 *       400:
 *         description: Erreur de validation
 *!/
router.post("/", CommandeController.createCommande);

/!**
 * @swagger
 * /api/commandes:
 *   get:
 *     summary: Récupérer la liste de toutes les commandes
 *     tags: [Commandes]
 *     responses:
 *       200:
 *         description: Liste des commandes
 *!/
router.get("/", CommandeController.getCommandes);

/!**
 * @swagger
 * /api/commandes/{id}:
 *   get:
 *     summary: Récupérer une commande par ID
 *     tags: [Commandes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la commande à récupérer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Commande trouvée
 *       404:
 *         description: Commande non trouvée
 *!/
router.get("/:id", CommandeController.getCommandeById);

/!**
 * @swagger
 * /api/commandes/{id}:
 *   put:
 *     summary: Mettre à jour une commande
 *     tags: [Commandes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la commande à modifier
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               produits:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     produitId:
 *                       type: string
 *                       example: "64df91bc34ef56gh78ij90kl"
 *                     quantite:
 *                       type: integer
 *                       example: 3
 *     responses:
 *       200:
 *         description: Commande mise à jour
 *       404:
 *         description: Commande non trouvée
 *!/
router.put("/:id", CommandeController.updateCommande);

/!**
 * @swagger
 * /api/commandes/{id}:
 *   delete:
 *     summary: Supprimer une commande
 *     tags: [Commandes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la commande à supprimer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Commande supprimée
 *       404:
 *         description: Commande non trouvée
 *!/
router.delete("/:id", CommandeController.deleteCommande);

module.exports = router;
*/


const express = require("express");
const router = express.Router();
const CommandeController = require("../controllers/CommandeController");

/**
 * @swagger
 * components:
 *   schemas:
 *     Commande:
 *       type: object
 *       required:
 *         - id_personne
 *         - id_restaurant
 *         - id_gestionnaire
 *         - qte_commande
 *       properties:
 *         id_personne:
 *           type: string
 *         id_restaurant:
 *           type: string
 *         id_gestionnaire:
 *           type: string
 *         qte_commande:
 *           type: number
 *         date_commande:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/commandes:
 *   post:
 *     summary: Créer une commande
 *     tags: [Commandes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Commande'
 *     responses:
 *       201:
 *         description: Commande créée avec succès
 */
router.post("/", CommandeController.createCommande);
/**
 * @swagger
 * /api/commandes:
 *   get:
 *     summary: Récupérer toutes les commandes
 *     tags: [Commandes]
 *     responses:
 *       200:
 *         description: Liste des commandes
 */
router.get("/", CommandeController.getCommandes);

/**
 * @swagger
 * /api/commandes{id}:
 *   get:
 *     summary: Récupérer une commande par ID
 *     tags: [Commandes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Commande trouvée
 *       404:
 *         description: Commande non trouvée
 */
router.get("/:id", CommandeController.getCommandeById);

/**
 * @swagger
 * /api/commandes/{id}:
 *   put:
 *     summary: Mettre à jour une commande
 *     tags: [Commandes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Commande'
 *     responses:
 *       200:
 *         description: Commande mise à jour
 */
router.put("/:id", CommandeController.updateCommande);

/**
 * @swagger
 * /commandes/{id}:
 *   delete:
 *     summary: Supprimer une commande
 *     tags: [Commandes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Commande supprimée
 */
router.delete("/:id", CommandeController.deleteCommande);

module.exports = router;
