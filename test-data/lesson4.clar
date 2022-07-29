;;         ____...------------...____
;;    _.-"` /o/__ ____ __ __  __ \o\_`"-._
;;  .'     / /                    \ \     '.
;;  |=====/o/======================\o\=====|
;;  |____/_/________..____..________\_\____|
;;  /   _/ \_     <_o#\__/#o_>     _/ \_   \
;;  \_________\####/_________/
;;   |===\!/========================\!/===|
;;   |   |=|          .---.         |=|   |
;;   |===|o|=========/     \========|o|===|
;;   |   | |         \() ()/        | |   |
;;   |===|o|======{'-.) A (.-'}=====|o|===|
;;   | __/ \__     '-.\uuu/.-'    __/ \__ |
;;   |==== .'.'^'.'.====|
;;   |  _\o/   __  {.' __  '.} _   _\o/  _|
;;   `""""-""""""""""""""""""""""""""-""""`

;; Shiver me timbers! You've mastered the seven seas and reached
;; Treasure Island! Now you've got to put everything you've learned together
;; to follow the map to the buried treasure.

;; Legend has it that Black Beard created this map, and you know he's not going
;; to make it easy for you. The map is encoded into a list of strings. Each
;; string specifies one step in a compass direction:
;;  * "North" (^)
;;  * "East"  (>)
;;  * "South" (v)
;;  * "West"  (<)
;; There are at most 15 steps in the map.
;; After you've followed all of the steps, make sure to collect the booty!
(define-data-var facing int 1)

(define-private (direction-to-int (direction (string-ascii 5)))
    (if (is-eq direction "North")
        0
        (if (is-eq direction "East")
            1
            (if (is-eq direction "South")
                2
                3
            )
        )
    )
)

(define-constant turn-lists
    (list
        (list)
        (list 1)
        (list 1 2)
        (list 1 2 3)
    )
)

(define-private (turn-left-x (x int))
    (turn-left)
)

(define-private (turn-right-x (x int))
    (turn-right)
)

(define-private (turn-to-direction (dir int))
    (let (
          (current (var-get facing))
          (raw-diff (- current dir))
          ;; raw-diff is -3..3, we want it to be in range -1..2
          (diff (if
                    (< raw-diff -1)
                    (+ raw-diff 4)
                    (if (> raw-diff 2) (- raw-diff 4) raw-diff)
                )
          )
         )
        (if
            (< diff 0)
            (map turn-right-x (try! (element-at turn-lists (to-uint (+ 2 diff)))))
            (map turn-left-x (try! (element-at turn-lists (to-uint diff))))
        )
        (var-set facing dir)
        none
    )
)

(define-private (step (direction (string-ascii 5)))
    (let ((dir (direction-to-int direction)))
        (turn-to-direction dir)
        (move-forward)
    )
)

(define-private (follow-the-map (treasure-map (list 15 (string-ascii 5))))
    (begin
        (map step treasure-map)
        (collect)
    )
)

;; ** Mission **
;;   Define a function to follow the directions on the map and help Toshi find
;;   the hidden bounty. Your function should be named "follow-the-map" and
;;   should take one argument, the map (you figure out the type)! When you
;;   press Run, Toshi will call this function with the map.
