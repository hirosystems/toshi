(define-private (ahoy)
    "Ahoy!"
)

(define-private (move-forward)
    (begin
        (print "@ACTION@: move-forward")
        true
    )
)

(define-constant count-lists 
    (list 
        (list 1)
        (list 1 2)
        (list 1 2 3)
        (list 1 2 3 4)
        (list 1 2 3 4 5)
        (list 1 2 3 4 5 6)
        (list 1 2 3 4 5 6 7)
        (list 1 2 3 4 5 6 7 8)
        (list 1 2 3 4 5 6 7 8 9)
        (list 1 2 3 4 5 6 7 8 9 10)
    )
)

(define-private (move-forward-simple (n int))
    (print "@ACTION@: move-forward")
)

(define-private (move-forward-n (count int))
    (begin
        (map move-forward-simple (default-to (list) (element-at count-lists (- (to-uint count) u1))))
        true
    )
)

(define-private (turn-left)
    (begin
        (print "@ACTION@: turn-left")
        true
    )
)

(define-private (turn-right)
    (begin
        (print "@ACTION@: turn-right")
        true
    )
)

(define-private (collect)
    (begin
        (print "@ACTION@: collect-coin")
        true
    )
)

(define-private (fight)
    (begin
        (print "@ACTION@: fight")
        true
    )
)

(define-private (board (password (string-ascii 32)))
    (begin
        (if (is-eq password "Captain Hooky")
            (print "@ACTION@: board")
            (print "@ACTION@: fail Blimey! Wrong answer. Try again scallywag.")
        )
        true
    )
)