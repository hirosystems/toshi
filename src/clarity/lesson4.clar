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