const Navigation = require("../models/navigation");

function addNavigation(req, res) { 
    const { title, url, order, active, left } = req.body;
    const navigation = new Navigation();

    navigation.title = title;
    navigation.url = url;
    navigation.order = order;
    navigation.active = active;
    navigation.left = left;

    navigation.save((err, creatednavigation) => { 
        if (err) {
            res.status(500).send({ message: "Error del servidor."});
        } else { 
            if (!creatednavigation) {
                res.status(404).send({ message: "Error al crear el navigation." });
            } else { 
                res.status(200).send({
                    message: "Navigation creado correctamente"
                })
            }
        }
    } )
}
function getNavigations(req, res) {
    Navigation.find()
        .sort({ order: "asc" })
        .exec((err, navigations) => {
            if (err) {
                res.status(500).send({ message: "Error del servidor ." });
            } else { 
                if (!navigations) {
                 res.status(404).send({ message: "No se ha encontrado ningún menú." });
                } else {
                    res.status(200).send({ navigations });
                }
            }
            
        });
}
function updateNavigation(req, res) { 
    let navigationData = req.body;
    const params = req.params;

    Navigation.findByIdAndUpdate(params.id, navigationData, (err, navigationUpdate) => { 
        if (err) {
            res.status(500).send({ message: "Error del servidor." });
        } else { 
            if (!navigationUpdate) {
                res.status(404).send({ message: "No se ha encontrado ningún Navigation." });
            } else { 
                res.status(200).send({ message: "Navigation actualizado correctamente." });
            }
        }
    })
}
function activateNavigation(req, res) { 
    const { id } = req.params;
    const { active } = req.body;

    Navigation.findByIdAndUpdate(id, { active }, (err,navigationStored) => { 
        if (err) {
            res.status(500).send({ message: "Error del servidor." });
        } else { 
            if (!navigationStored) {
                res.status(404).send({ message: "No se ha encontrado el navigation." });
            } else { 
                if (active === true) {
                    res.status(200).send({ message: "navigation activado correctamente." });
                } else { 
                    res.status(200).send({ message: "navigation desactivado correctamente." });
                }
            }
        }
    })
}

function deleteNavigation(req, res) { 
    const { id } = req.params;
    Navigation.findByIdAndRemove(id, (err, navigation) => { 
        if (err) { 
            res.status(500).send({message:"Error del servidor"})
        } else {
            if (!navigation) {
                res.status(404).send({ message: "No se ha encontrado el menú" })
            } else { 
                res.status(500).send({ message: "Menú borrado correctamente."})
            }
        }
    })

}
module.exports = {
    addNavigation,
    getNavigations,
    updateNavigation,
    activateNavigation,
    deleteNavigation
}